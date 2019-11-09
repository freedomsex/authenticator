
import 'regenerator-runtime/runtime';

import { shallowMount } from '@vue/test-utils';
import Authenticator from '../Authenticator.vue';

import jwt from 'jwt-simple';
import nanoid from 'nanoid';
// import time from 'expires-unixtime';
import timestamp from 'unix-timestamp-offset';

describe('Проверить токен', () => {
  const ttl = 3600;
  const lifetime = 2592000;
  let template;

  beforeEach(() => {
    let payload = {
      uid: 1234,
      roles: ['ROLE_USER'],
    };
    template = {
      uid: 1234,
      access: jwt.encode(payload, 'secret'),
      refresh: nanoid(32),
      expires: timestamp(ttl),
      created: timestamp(),
      access_ttl: ttl,
      lifetime,
    };
  });

  it('access токен отсутствует', () => {
    let token = Object.assign({}, template, {
      access: null,
    });
    // console.log(token);
    const wrapper = shallowMount(Authenticator, {
      propsData: {
        token,
        auth: 1,
        trigger: 200,
        period: 3
      },
    });
    expect(wrapper.emitted().refresh.length).toBe(1);
    expect(wrapper.vm.left).toBe(ttl); // ~3600
    expect(wrapper.vm.attempt).toBe(1);
    // Доступно обновление: есть refresh токен и его время жизни не истекло
    expect(wrapper.vm.available).toBeTruthy();
    expect(wrapper.vm.authorized).toBeTruthy();
    expect(wrapper.vm.process).toBeTruthy();
    expect(wrapper.vm.needed).toBeFalsy();
    expect(wrapper.vm.expired).toBeFalsy();
    expect(wrapper.vm.stopped).toBeFalsy();
    expect(wrapper.vm.alert).toBeFalsy();
    expect(wrapper.vm.skipError).toBeFalsy();
  });

  it('refresh токен отсутствует', () => {
    let token = Object.assign({}, template, {
      refresh: null,
    });
    const wrapper = shallowMount(Authenticator, {
      propsData: {
        token,
        auth: 1,
        trigger: 200,
        period: 3
      },
    });
    expect(wrapper.emitted('refresh')).toBeFalsy();
    expect(wrapper.vm.left).toBe(ttl);
    expect(wrapper.vm.attempt).toBe(0);
    expect(wrapper.vm.available).toBeFalsy();
    expect(wrapper.vm.expired).toBeFalsy();
    expect(wrapper.vm.stopped).toBeFalsy();
    expect(wrapper.vm.process).toBeFalsy();
    expect(wrapper.vm.needed).toBeFalsy();
  });

  it('access токен истек - expired', () => {
    let offset = -10;
    let token = Object.assign({}, template, {
      expires: timestamp(offset),
    });
    const wrapper = shallowMount(Authenticator, {
      propsData: {
        token,
        auth: 1,
        trigger: 200,
        period: 3
      },
    });
    expect(wrapper.emitted().refresh.length).toBe(1);
    expect(wrapper.vm.left).toBe(offset);
    expect(wrapper.vm.attempt).toBe(1);
    // Доступно обновление: есть refresh токен и его время жизни не истекло
    expect(wrapper.vm.available).toBeTruthy();
    expect(wrapper.vm.authorized).toBeTruthy();
    expect(wrapper.vm.process).toBeTruthy();
    expect(wrapper.vm.needed).toBeTruthy();
    expect(wrapper.vm.expired).toBeFalsy(); // == propsData.auth [!!!]
    expect(wrapper.vm.stopped).toBeFalsy();
    expect(wrapper.vm.alert).toBeFalsy();
  });

  it('токен просрочен - lifetime', () => {
    let offset = -10;
    let token = Object.assign({}, template, {
      expires: timestamp(offset),
      created: timestamp(offset - lifetime),
    });
    const wrapper = shallowMount(Authenticator, {
      propsData: {
        token,
        auth: 1,
        trigger: 200,
        period: 3
      },
    });
    expect(wrapper.emitted('refresh')).toBeFalsy();
    expect(wrapper.vm.left).toBe(offset);
    expect(wrapper.vm.attempt).toBe(0);
    // Доступно обновление: есть refresh токен и его время жизни не истекло
    expect(wrapper.vm.available).toBeFalsy();
    expect(wrapper.vm.process).toBeFalsy();
    expect(wrapper.vm.needed).toBeTruthy();
    expect(wrapper.vm.authorized).toBeTruthy();
    expect(wrapper.vm.expired).toBeFalsy(); // == propsData.auth [!!!]
    expect(wrapper.vm.stopped).toBeFalsy();
    expect(wrapper.vm.alert).toBeFalsy();
  });

  it('trigger time нет', () => {
    let token = Object.assign({}, template, {
      expires: timestamp(300),
    });
    const wrapper = shallowMount(Authenticator, {
      propsData: {
        token,
        auth: 1,
        trigger: 200,
        period: 3
      },
    });
    expect(wrapper.vm.needed).toBeFalsy();
  });

  it('trigger time да', () => {
    let token = Object.assign({}, template, {
      expires: timestamp(100),
    });
    const wrapper = shallowMount(Authenticator, {
      propsData: {
        token,
        auth: 1,
        trigger: 200,
        period: 3
      },
    });
    expect(wrapper.vm.needed).toBeTruthy();
  });

});
