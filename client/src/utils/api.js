const apis = () => {
    const local = "http://localhost:5000";
    
    const list = {
      login: `${local}/user/login`,
      register: `${local}/user/register`,
      newItem: `${local}/item/new`,
      newCustomer: `${local}/customer/create`,
      newOrderPayment: `${local}/orderPayment/create`,
      newDesign: `${local}/design/create`,
      newOrder: `${local}/order/newOrder`,
      images: `${local}/gallery/upload`,
    };
    
    return list;
  };
  
  export default apis;