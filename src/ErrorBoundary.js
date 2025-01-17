import React from 'react';
import Skeleton from './components/layout/Skeleton';
import { Route } from 'react-router-dom'

class ErrorBoundary extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      hasError: false
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error,errorInfo)  
  }

  render() {
    if(this.state.hasError){
      return (
        <Skeleton id="ErrorPage" theme="light" fullFooter>
          <div class="error-404">
        <div class="error-code m-b-10 m-t-20">Oops <i class="fa fa-warning"></i></div>
        <h2 class="font-bold">Oops! There is something wrong with the app. This is embarassing. We will be on the issue and will fix it soon.</h2>

        <div class="error-desc">
            Sorry, but the application is currently under maintainence or repair/ <br/>
            Try refreshing the page or wait for some time before coming back.
            <div><br/>

                <a href="/" class="btn btn-primary"><span class="fas fa-home"></span> Go back to Homepage</a>
            </div>
        </div>
        </div>
        </Skeleton>
      );
    } else {
      return this.props.children
    }
  }
};

const RouteWithErrorBoundary = (props) => {
  return (
    <ErrorBoundary key={`${props.path}-${props.exact ? true : false}`}>
      <Route {...props} />
     </ErrorBoundary>
  )
}

export default RouteWithErrorBoundary;

