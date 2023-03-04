import { ThemeConfig } from 'antd/es/config-provider/context'
import { AliasToken } from 'antd/es/theme'

const PRIMARY = '#090761';

export const THEME: Partial<ThemeConfig> = {
  token: {
    colorPrimary: PRIMARY,
    colorTextHeading: PRIMARY,
    colorText: '#2F2D51',
    colorPrimaryActive: '#fff',
    fontFamily: 'Jost'
  },
  components: {
    Menu: {
      colorBgBase: '#fff',
      colorLinkActive: '#fff',
      colorItemBgSelected: 'rgba(0, 0, 0, 0.2)',
      colorItemTextSelected: PRIMARY,
      colorItemText: PRIMARY
    },
    Collapse: {
      //   coorho
    },
    Button: {
      boxShadow: 'none'
    },
    Modal: {
      colorPrimary: PRIMARY
    }
  }
}
