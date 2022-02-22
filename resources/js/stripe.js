import {loadStripe} from '@stripe/stripe-js';
import { placeOrder } from './apiService';
export async function  initStripe(){
    const stripe = await loadStripe('pk_test_51KTRSPSAWd49FjHoSPT6No1DXRQXStFnIxpJayIfNiIuejmJyVLHmvbvmaMroMuKiu5N4loZ6QNGuhfoFSUOeSQk00WQ5rW4fF');
    let card=null;
 function mountWidget() {
    const elements = stripe.elements()

        let style = {
            base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            }
            },
            invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
            }
        };

        card = elements.create('card', { style, hidePostalCode: true })
        card.mount('#card-element')
    }

    const paymentType=document.querySelector('#paymentType')
    if(!paymentType) {
        return;
    }
    paymentType.addEventListener('change',(e)=>{
        
       if(e.target.value === 'card'){
           //display widget
        mountWidget()
       }
       else{
        card.destroy()
       }
    })
//Ajax call
const paymentform=document.querySelector('#payment-form');

if(paymentform){
    paymentform.addEventListener('submit',(e)=>{
        e.preventDefault();
        let formData=new FormData(paymentform);
        let formObject={};
 
        for(let [key,value] of formData.entries()){
            formObject[key]=value;
         
        }

        //verify
 if(!card){
     //ajax
     placeOrder(formObject)
     return;
 }
        stripe.createToken(card).then((result)=>{
          
          formObject.stripeToken=result.token.id;
          placeOrder(formObject)
        }).catch((err)=>{
            console.log(err)
        })
       
        
 })
}
}