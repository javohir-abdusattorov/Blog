import axios from 'axios'


export default {
	methods: {
    async checkAuthorization() {
      const token = localStorage["access-token"]
      if (!token) return false

      try {
        const res = await axios({
          method: 'get',
          url: `${process.env.VUE_APP_MAIN_URL}/api/v1/auth/me`,
          headers: { "Authorization": `Bearer ${token}` },
        })

        return { isAuthorized: true, user: res.data.data }
      } catch (error) {
        console.error(error)
        localStorage.removeItem("access-token")
        return { isAuthorized: false }
      }
    }
	}
}