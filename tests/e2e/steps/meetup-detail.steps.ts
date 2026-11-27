import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { request, type APIRequestContext, type Page } from 'playwright';

const API_BASE_URL = process.env.E2E_API_BASE_URL ?? 'http://127.0.0.1:8080';
const WEB_BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:3000';
const PASSWORD = process.env.E2E_PASSWORD ?? 'Azqw4321';

function unique(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function basicHeader(username: string): string {
  return `Basic ${Buffer.from(`${username}:${PASSWORD}`).toString('base64')}`;
}

async function authContext(username: string): Promise<APIRequestContext> {
  return request.newContext({
    baseURL: API_BASE_URL,
    extraHTTPHeaders: {
      Authorization: basicHeader(username),
      Accept: 'application/hal+json',
      'Content-Type': 'application/json',
    },
  });
}

async function signInAs(page: Page, username: string): Promise<void> {
  await page.context().addCookies([{
    name: 'MYAPP_AUTH',
    value: encodeURIComponent(basicHeader(username)),
    url: WEB_BASE_URL,
    sameSite: 'Strict',
  }]);
}

async function createUser(api: APIRequestContext, prefix: string): Promise<string> {
  const username = unique(prefix);
  const response = await api.post('/users', {
    data: { username, email: `${username}@sample.app`, password: PASSWORD, displayName: username },
  });
  expect(response.status()).toBe(201);
  return username;
}

async function createdId(response: Awaited<ReturnType<APIRequestContext['post']>>): Promise<string> {
  const text = await response.text();
  if (text) {
    try {
      const body = JSON.parse(text) as { id?: number; uri?: string };
      const fromBody = String(body.id ?? body.uri?.split('/').filter(Boolean).pop() ?? '');
      if (fromBody && fromBody !== 'undefined') return fromBody;
    } catch {
      // Spring Data REST may answer with an empty body and only a Location header.
    }
  }
  const location = response.headers()['location'];
  const fromHeader = location?.split('/').filter(Boolean).pop();
  if (!fromHeader) throw new Error('The backend did not return the created resource id');
  return fromHeader;
}

type MeetupFixtureWorld = {
  api: APIRequestContext;
  meetupId?: string;
  meetupTitle?: string;
  meetupDescription?: string;
  meetupVisibilityLabel?: string;
  meetupOwner?: string;
};

async function createMeetup(
  world: MeetupFixtureWorld,
  visibility: 'PUBLIC' | 'PRIVATE' | 'GROUP',
  groupId?: string,
): Promise<void> {
  if (!world.meetupOwner) world.meetupOwner = await createUser(world.api, 'owner');
  const api = await authContext(world.meetupOwner);
  try {
    world.meetupTitle = `Quedada E2E ${unique('detalle')}`;
    world.meetupDescription = 'Descripción usada por las pruebas del detalle.';
    world.meetupVisibilityLabel = visibility === 'PRIVATE' ? 'Privada' : visibility === 'GROUP' ? 'Del grupo' : 'Pública';
    const data: Record<string, unknown> = {
      title: world.meetupTitle,
      description: world.meetupDescription,
      capacity: 3,
      category: 'SPORTS',
      visibility,
      status: 'OPEN',
      startDate: '2027-01-15T10:00:00Z',
      endDate: '2027-01-15T12:00:00Z',
      price: 5,
      location: {
        name: 'Sala A',
        address: 'Carrer Major 1',
        city: 'Lleida',
        latitude: 41.6,
        longitude: 0.62,
      },
    };
    if (groupId) data.group = `/groups/${groupId}`;
    const response = await api.post('/meetups', { data });
    expect(response.status()).toBe(201);
    world.meetupId = await createdId(response);
  } finally {
    await api.dispose();
  }
}

async function createGroupMeetup(world: MeetupFixtureWorld): Promise<void> {
  world.meetupOwner = await createUser(world.api, 'owner');
  const api = await authContext(world.meetupOwner);
  let groupId: string;
  try {
    const response = await api.post('/groups', {
      data: { name: `Grupo E2E ${unique('grupo')}`, description: 'Grupo de prueba', visibility: 'PUBLIC' },
    });
    expect(response.status()).toBe(201);
    groupId = await createdId(response);
  } finally {
    await api.dispose();
  }
  await createMeetup(world, 'GROUP', groupId);
}

Given('a public meetup created by a test user', async function () {
  await createMeetup(this as unknown as MeetupFixtureWorld, 'PUBLIC');
});

Given('a private meetup created by a test user', async function () {
  await createMeetup(this as unknown as MeetupFixtureWorld, 'PRIVATE');
});

Given('a group meetup created by a test user', async function () {
  await createGroupMeetup(this as unknown as MeetupFixtureWorld);
});

Given('a second test user', async function () {
  this.visitorUsername = await createUser(this.api, 'visitor');
});

Given('an invitation for the visitor to the meetup', async function () {
  const api = await authContext(this.meetupOwner!);
  try {
    const response = await api.post('/invitations', {
      data: { invitee: `/users/${this.visitorUsername}`, meetup: `/meetups/${this.meetupId}` },
    });
    expect(response.status()).toBe(201);
  } finally {
    await api.dispose();
  }
});

When('I open the meetup detail page as the owner', async function () {
  await signInAs(this.page, this.meetupOwner!);
  await this.page.goto(`${WEB_BASE_URL}/meetups/${this.meetupId}`);
});

When('I open the meetup detail page as the visitor', async function () {
  await signInAs(this.page, this.visitorUsername!);
  await this.page.goto(`${WEB_BASE_URL}/meetups/${this.meetupId}`);
});

When('I open a missing meetup detail page as the owner', async function () {
  await signInAs(this.page, this.meetupOwner!);
  await this.page.goto(`${WEB_BASE_URL}/meetups/999999999`);
});

When('I cancel the meetup', async function () {
  await this.page.getByTestId('cancel-meetup').click();
  await this.page.getByRole('dialog').getByRole('button', { name: 'Cancelar quedada' }).click();
});

Then('I should see the meetup details', async function () {
  await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(this.meetupTitle!);
  await expect(this.page.getByText(this.meetupDescription!, { exact: true })).toBeVisible();
  await expect(this.page.getByText('Organizador', { exact: true })).toBeVisible();
  await expect(this.page.getByText(this.meetupOwner!, { exact: true })).toBeVisible();
  await expect(this.page.getByText('Deporte', { exact: true })).toBeVisible();
  await expect(this.page.getByText('Abierta', { exact: true })).toBeVisible();
  await expect(this.page.getByText(this.meetupVisibilityLabel!, { exact: true }).first()).toBeVisible();
  await expect(this.page.getByText('5 €', { exact: true })).toBeVisible();
  await expect(this.page.getByText('Carrer Major 1')).toBeVisible();
  await expect(this.page.getByTestId('meetup-occupancy')).toContainText('/ 3');
});

Then('I should see the meetup placeholders', async function () {
  for (const heading of ['Comentarios', 'Valoraciones', 'Chat']) {
    await expect(this.page.getByRole('heading', { name: heading, level: 2 })).toBeVisible();
  }
});

Then('I should see the organizer actions for a public meetup', async function () {
  for (const testId of ['edit-meetup', 'cancel-meetup', 'invite-meetup', 'comment-meetup']) {
    await expect(this.page.getByTestId(testId)).toBeVisible();
  }
});

Then('I should not see the organizer actions for a public meetup', async function () {
  for (const testId of ['edit-meetup', 'cancel-meetup', 'invite-meetup']) {
    await expect(this.page.getByTestId(testId)).toHaveCount(0);
  }
});

Then('I should see the join action', async function () {
  await expect(this.page.getByTestId('join-meetup')).toBeVisible({ timeout: 15000 });
});

Then('I should not see the join action', async function () {
  await expect(this.page.getByTestId('join-meetup')).toHaveCount(0);
});

Then('I should see the leave action', async function () {
  await expect(this.page.getByTestId('leave-meetup')).toBeVisible({ timeout: 15000 });
});

Then('I should see the comment action', async function () {
  await expect(this.page.getByTestId('comment-meetup')).toBeVisible();
});

When('I click the join action', async function () {
  await this.page.getByTestId('join-meetup').click();
});

When('I click the leave action', async function () {
  await this.page.getByTestId('leave-meetup').click();
});

Then('I should see the friendly access denied page', async function () {
  await expect(this.page.getByText('No tienes acceso a esta quedada')).toBeVisible();
  await expect(this.page.getByText('Ver otras quedadas')).toBeVisible();
});

Then('I should not see the meetup title', async function () {
  await expect(this.page.getByRole('heading', { name: this.meetupTitle! })).toHaveCount(0);
});

Then('I should see the cancelled meetup', async function () {
  await expect(this.page.getByText('Cancelada', { exact: true })).toBeVisible({ timeout: 15000 });
  await expect(this.page.getByTestId('cancel-meetup')).toHaveCount(0);
});

Then('I should see the friendly not found page', async function () {
  await expect(this.page.getByText('No hemos encontrado la quedada')).toBeVisible();
  await expect(this.page.getByText('Volver a quedadas')).toBeVisible();
});
