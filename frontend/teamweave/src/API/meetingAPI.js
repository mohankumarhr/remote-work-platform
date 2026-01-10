import axios from 'axios'
import Cookies from 'js-cookie'

// const serviceUrl = "http://localhost:8089"

const serviceUrl = "https://call-service-dpcq.onrender.com"

export const fetchMeetingsByTeam = async (teamId) => {
  try {
    const res = await axios.get(`${serviceUrl}/meeting/by-team`, {
      params: { teamId },
      // headers: {
      //   'Content-Type': 'application/json',
      //   Authorization: `Bearer ${Cookies.get('jwtToken')}`
      // }
    })
    return res.data
  } catch (err) {
    console.error('fetchMeetingsByTeam error', err)
    throw err
  }
}

export const createMeeting = async ({ title, description, startTime, duration, teamId, organizerId }) => {
  try {
    const res = await axios.post(`${serviceUrl}/meeting/create`,
      { title, description, startTime, duration, teamId, organizerId },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('jwtToken')}`
        }
      }
    )
    return res.data
  } catch (err) {
    console.error('createMeeting error', err)
    throw err
  }
}

export default { fetchMeetingsByTeam, createMeeting }
