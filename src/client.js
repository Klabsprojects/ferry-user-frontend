import { GraphQLClient } from 'graphql-request';
import { getRequest } from './utils/requests';
import config from './config';
import React from 'react'
import { withRouter } from "react-router";
import { Redirect } from 'react-router-dom'
import { AwesomeGraphQLClient } from 'awesome-graphql-client'
const nodeFetch = require('node-fetch')

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL || config.backendUrl}/api`

const client = new GraphQLClient(BASE_URL, { credentials: 'include' });

const makeRequest = async (request, variables) => {
	try{
		const response = variables ? await client.request(request, variables) : await client.request(request)
		return response;
	} catch(err){
		if(err.response.error === "jwt expired"){
			try {
				// refresh token
				const refresh = await getRequest(`${process.env.REACT_APP_BACKEND_URL || config.backendUrl}/auth/refresh`)
				// make request again
				const response = variables ? await client.request(request) : await client.request(request,variables)
				return response;
			} catch (err) {
				return new Error("Cannot refresh")
			}
		} else if(err.response.error === "no token"){
			// logout
		} else {
			return new Error("Error in request")
		}
	}
}

const withAwesomeClient = (Component) => {
	class withAwesomeClientClass extends React.Component {
		constructor(props){
			super(props)
			const BASE_URL = `${process.env.REACT_APP_BACKEND_URL || config.backendUrl}/api`
			this.client = new AwesomeGraphQLClient({ endpoint: BASE_URL, fetchOptions: {credentials: "include"}});
			this.state = {
				redirect: false
			}
		}

		makeRequest = async (request, variables) => {
			try{
				const response = variables ? await this.client.request(request, variables) : await this.client.request(request)
				return response;
			} catch(err){
				if(!err.response){
					console.log("server error")
					console.log(err.response)
					return new Error("Server not responding")
				}
				if(err.response.error === "jwt expired"){
					try {
						// refresh token
						const refresh = await getRequest(`${process.env.REACT_APP_BACKEND_URL || config.backendUrl}/auth/refresh`)
						// make request again
						const response = variables ? await this.client.request(request,variables) : await this.client.request(request)
						return response;
					} catch (err) {
						return new Error("Cannot refresh")
					}
				} else if(err.response.error === "no token"){
					this.setState({redirect: true})
				} else {
					throw new Error(err.response.errors[0].message)
				}
			}
		}

		render(){
			const { match, location, history, ...componentProps } = this.props;
			const { redirect } = this.state;
			if(redirect)
				return (<Redirect to="/logout" />)
			return(
				<Component {...componentProps} makeRequest={this.makeRequest}/>
			)
		}
	}

	return withAwesomeClientClass
}

const withClient = (Component) => {
	class withClientClass extends React.Component {
		constructor(props){
			super(props)
			this.BASE_URL = `${process.env.REACT_APP_BACKEND_URL || config.backendUrl}/api`
			this.state = {
				redirect: false
			}
		}

		makeRequest = async (request, variables, headers) => {
			let client = null;
			if(headers)
				client = new GraphQLClient(this.BASE_URL,{ headers: headers}, { credentials: 'include' });
			else
				client = new GraphQLClient(this.BASE_URL,{ credentials: 'include' });
			try{
				const response = variables ? await client.request(request, variables) : await client.request(request)
				return response;
			} catch(err){
				if(!err.response){
					console.log("server error")
					return new Error("Server not responding")
				}
				if(err.response.error === "jwt expired"){
					try {
						// refresh token
						const refresh = await getRequest(`${process.env.REACT_APP_BACKEND_URL || config.backendUrl}/auth/refresh`)
						// make request again
						const response = variables ? await client.request(request,variables) : await client.request(request,variables)
						return response;
					} catch (err) {
						return new Error("Cannot refresh")
					}
				} else if(err.response.error === "no token"){
					this.setState({redirect: true})
				} else {
					throw new Error(err.response.errors[0].message)
				}
			}
		}

		render(){
			const { match, location, history, ...componentProps } = this.props;
			const { redirect } = this.state;
			if(redirect)
				return (<Redirect to="/logout" />)
			return(
				<Component {...componentProps} makeRequest={this.makeRequest}/>
			)
		}
	}

	return withClientClass
}

export { makeRequest, withClient, withAwesomeClient }