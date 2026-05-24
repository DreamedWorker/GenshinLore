import Cookies from 'js-cookie'

function getCookie(name: string): string | null {
  return Cookies.get(name) ?? null
}

function setCookie(name: string, value: string) {
  Cookies.set(name, value, { expires: new Date('2999-12-31T23:59:59Z') })
}

const cookies = { getCookie, setCookie }

export default cookies
