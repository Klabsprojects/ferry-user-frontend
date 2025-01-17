import React from 'react';
import { useReactToPrint } from "react-to-print";

export default (props) => {
  const bodyRef = React.createRef();
  const createPdf = () => props.createPdf(bodyRef.current);
  
  // const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => bodyRef.current,
  });
  return (
    <section className="pdf-container">
      <section className="pdf-toolbar mb-4">
      <button 
        type="button" 
        className='btn btn-primary'
        style={{padding:10,borderRadius:10,width:200}}
        onClick={createPdf}>
            Download Ticket
      </button>
      <button 
        type="button" 
        className='btn btn-primary'
        style={{padding:10,borderRadius:10,width:200 ,float:"right"}}
        onClick={handlePrint}>
            Print Ticket
      </button>
      <br />
      </section>
      <section className="pdf-body" ref={bodyRef}>
        {props.children}
      </section>
    </section>
  )
}