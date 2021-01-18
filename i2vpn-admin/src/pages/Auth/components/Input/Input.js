import React from "react";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import "./Input.css";
const input = (props) => {

  let inputElement = null;
  const inputClasses = ["p-inputtext-float"];
  inputClasses.push(props.className);
  switch (props.elementType) {

    case "input":
      inputElement = (
        <>          
          <InputText
            className={inputClasses.join(' ')}
            {...props.elementConfig}
            value={props.value}
            onChange={props.changed}           
          />
        </>
      );
      break;
   
    case "checkbox":
      inputElement = (
        <>
          <div className="p-mt-5"></div>
            <Checkbox checked={props.checked} onChange={props.changed}></Checkbox>
        </>
      );
      break;
   
     default:
      inputElement = (
        <>          
        <InputText
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}           
        />
      </>
      );
  }

  return inputElement;
};

export default input;
