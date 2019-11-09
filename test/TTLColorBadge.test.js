import 'regenerator-runtime/runtime';

import { shallowMount } from '@vue/test-utils';
import TTLColorBadge from '../TTLColorBadge.vue';

// import jwt from 'jwt-simple';
// import nanoid from 'nanoid';
// import time from 'expires-unixtime';
// import timestamp from 'unix-timestamp-offset';

describe('Проверит', () => {
  let props = {
    left: 400,
    accent: 30,
    minimum: 3,
    ttl: 600,
    lifetime: 3000,
  };

  beforeEach(() => {

  });

  it('normal', () => {
    const wrapper = shallowMount(TTLColorBadge, {
      propsData: props,
    });
    expect(wrapper.vm.normal).toBe(180);
    expect(wrapper.vm.warning).toBe(-2910);
    expect(wrapper.vm.color).toEqual({
      'badge-primary': true,
      'badge-success': false,
      'badge-secondary': false,
      'badge-warning': false,
      'badge-danger': false,
    });
  });

  it('success', () => {
    const wrapper = shallowMount(TTLColorBadge, {
      propsData: Object.assign({}, props, {
        left: 150,
      }),
    });
    expect(wrapper.vm.color).toEqual({
      'badge-primary': false,
      'badge-success': true,
      'badge-secondary': false,
      'badge-warning': false,
      'badge-danger': false,
    });
  });

  it('secondary', () => {
    const wrapper = shallowMount(TTLColorBadge, {
      propsData: Object.assign({}, props, {
        left: -2000,
      }),
    });
    expect(wrapper.vm.color).toEqual({
      'badge-primary': false,
      'badge-success': false,
      'badge-secondary': true,
      'badge-warning': false,
      'badge-danger': false,
    });
  });

  it('warning', () => {
    const wrapper = shallowMount(TTLColorBadge, {
      propsData: Object.assign({}, props, {
        left: -2950,
      }),
    });
    expect(wrapper.vm.color).toEqual({
      'badge-primary': false,
      'badge-success': false,
      'badge-secondary': false,
      'badge-warning': true,
      'badge-danger': false,
    });
  });

  it('danger', () => {
    const wrapper = shallowMount(TTLColorBadge, {
      propsData: Object.assign({}, props, {
        left: -5000,
      }),
    });
    console.log(wrapper.find('span').text());
    expect(wrapper.vm.color).toEqual({
      'badge-primary': false,
      'badge-success': false,
      'badge-secondary': false,
      'badge-warning': false,
      'badge-danger': true,
    });
  });

});
