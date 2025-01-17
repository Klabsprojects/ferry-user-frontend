import axios from 'axios';

const postRequest = async (url, data, options = {}) => {
	const baseConfig = {
	  method: 'post',
	  url: url,
	  headers: { 
	    'Content-Type': 'application/json'
	  },
	  data : JSON.stringify(data),
	  withCredentials: true,
	}

	const config = Object.assign({},baseConfig,options)
	try {
		const response = await axios(config)
		return response
	} catch(err) {
		throw new Error(err.response.data)
	}
}

const getRequest = async (url,options = {}) => {
	const baseConfig = {
	  method: 'get',
	  url: url,
	  withCredentials: true,
	}

	const config = Object.assign({},baseConfig,options)
	try {
		const response = await axios(config)
		return response
	} catch(err) {
		throw new Error(err.response.data)
	}
}

export { postRequest, getRequest }