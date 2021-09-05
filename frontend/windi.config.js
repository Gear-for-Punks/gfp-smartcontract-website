import { defineConfig } from 'windicss/helpers'
import colors from 'windicss/colors'
// import plugin from 'windicss/plugin'

export default defineConfig({
    theme: {
        extend: {
            colors: {
                gray: colors.coolGray,
                blue: colors.lightBlue,
                red: colors.rose,
                pink: colors.fuchsia,
                'primary': '#222'
            },
            fontFamily: {
                sans: ['monospace', 'sans-serif'],
                serif: ['monospace', 'serif'],
            },
        }
    }
})