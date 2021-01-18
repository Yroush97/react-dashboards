import React, { useState } from 'react';
import Input from '../components/Input/Input';
import { Button } from 'primereact/button';
import PrimeReact from 'primereact/utils';
import { updateObject } from "../../../shared/utility";
import { connect } from "react-redux";
import classNames from 'classnames';
import IMG from '../../../assets/images/login.png';
import * as actions from "../../../store/actions/index";
import "./Login.css";
PrimeReact.ripple = true;
const Login = (props) => {
  const [submitted, setSubmitted] = useState(false);
  const [authLogin, setAuthLogin] = useState({
    email: {
      label: "Email",
      elementType: 'input',
      elementConfig: {
        type: 'email',
      },
      icon: 'pi pi-user',
      value: ''

    },
    password: {
      label: "Password",
      elementType: 'input',
      elementConfig: {
        type: 'password',
        autoComplete: 'on',
      },
      icon: 'pi pi-lock',
      value: '',
    },
    remember_me: {
      label: "Remmber me",
      elementType: "checkbox",
      elementConfig: {
        type: "checkbox",
      },
      checked: false,
    },
  });

  const inputChangedHandler = (event, inputIdentifier) => {
    const updatedFormElement = updateObject(authLogin[inputIdentifier], {
      value: event.target.value,
      checked: event.target.checked,
    });
    const updatedLoginForm = updateObject(authLogin, {
      [inputIdentifier]: updatedFormElement,
    });
    setAuthLogin(updatedLoginForm);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setSubmitted(true);
    const formData = {};
    for (let formElementIdentifier in authLogin) {
      formData[formElementIdentifier] = (formElementIdentifier === "remember_me"? authLogin[formElementIdentifier].checked : authLogin[formElementIdentifier].value) 
    }
    if(authLogin.email.value !== "" && authLogin.password.value !== "")
    {
      props.onAuthLogin(formData.email, formData.password, formData.remember_me);
    }
    
  };

  const formElementsArray = [];
  for (let key in authLogin) {
    formElementsArray.push({
      id: key,
      config: authLogin[key],
    });
  }

  let LoginForm =
    formElementsArray.map((formElement) => (
      <div key={formElement.id} className="p-field p-mt-5">
        <span className="p-float-label p-input-icon-left">
          <i className={formElement.config.icon} />
          <Input
            className={classNames({ 'p-invalid': submitted && formElement.config.value === "" })}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            checked={formElement.config.checked}
            changed={(event) => inputChangedHandler(event, formElement.id)}
          />
          <label htmlFor={formElement.id}>{formElement.config.label}</label>
        </span>
        {submitted && formElement.config.value === "" && <small className="p-invalid">This field is required.</small>}
      </div>
      
    ));

   return (
    <div className="container">
      <div className="section-one">
        <img className="img" src={IMG} alt="logo" />
      </div>
      <div className="section-two">
        <span className="signIn">Sign in</span>
          <form className='form' onSubmit={submitHandler}>
            <div className="p-fluid login-form">
              {LoginForm}
              {submitted && props.error !== null && <small className="p-invalid">{props.error}</small>}
            </div>
            <Button className="button" label="Sign in" />
          </form>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    error: state.auth.error 
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onAuthLogin: (email, password, remember_me) => dispatch(actions.authSignin(email, password, remember_me)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);