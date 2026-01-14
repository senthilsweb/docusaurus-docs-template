import React from 'react';
import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import ThemeSwitcher from '@site/src/theme/ThemeSwitcher';

// Add our custom navbar item type
export default {
  ...ComponentTypes,
  'custom-themeSwitcher': ThemeSwitcher,
};
