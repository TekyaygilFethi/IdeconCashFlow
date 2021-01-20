import axios from 'axios';
import errorHandler from './utils/errorHandler';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert2';
import { all } from 'q';

toast.configure({
  autoClose: 2000,
  draggable: true,
  closeOnClick: true,
});


const { REACT_APP_API_URL } = process.env;

const axiosInstance = axios.create({
  baseURL: REACT_APP_API_URL
}, all);

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:5000",
// });





export const client = axiosInstance;

client.interceptors.response.use(
  response => {
    if (response.config.url.indexOf('Login') !== -1 ||
      response.config.url.indexOf('CreateHeader') !== -1 ||
      response.config.url.indexOf('CreateItem') !== -1 ||
      response.config.url.indexOf('GetItemsPerDate') !== -1) {
      toast.success(response.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }


    return response
  },
  error => {
    if (error.config.url.indexOf('GetDetail') === -1 &&
      error.config.url.indexOf('CreateHeader') === -1 &&
      error.config.url.indexOf('GetAllHeaders') === -1 &&
      error.config.url.indexOf('GetItemsPerDate') === 1 &&
      error.config.url.indexOf('headers') === -1) {
      if (error.response.status === '400') {
        toast.error(error.response.data.message, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      } else {

        errorHandler(error);
      }

    }



    return Promise.reject(error);
  },
);
export default {
  inputHeaders: data =>
    client({
      method: 'GET',
      url: `/GetAllIncomeHeaders`, //https://localhost:44383/api/Baslik/GetAllBasliklar
      params: data
    }).then(res => res),
  outputHeaders: data =>
    client({
      method: 'GET',
      url: `/GetAllOutcomeHeaders`, //https://localhost:44383/api/Baslik/GetAllBasliklar
      params: data
    }).then(res => res),
  mainTotals: data =>
    client({
      method: 'GET',
      url: `/GetMainTotal`, //https://localhost:44383/api/Baslik/GetAllBasliklar
      params: data
    }).then(res => res),
  getDetail: data =>
    client({
      method: 'GET',
      url: `/GetDetail`, //http://localhost:44383/api/Baslik/GetBasliklarWithDate
      params: data
    }).then(res => res),
  saveTitle: data =>
    client({
      method: 'POST',
      url: '/CreateHeader',
      data: data
    }).then(res => res),
  saveItem: data =>
    client({
      method: 'POST',
      url: '/CreateItem',
      data: data
    }).then(res => res),
  auth: data =>
    client({
      method: 'POST',
      url: '/Login',
      data: data
    }).then(res => res),
  mainHeader: data =>
    client({
      method: 'GET',
      url: '/headers',
      params: data
    }).then(res => res),
  exchanges: data =>
    client({
      method: 'GET',
      url: '/exchanges',
      params: data
    }).then(res => res),
  getItems: data =>
    client({
      method: 'GET',
      url: '/getItems',
      params: data
    }).then(res => res),
  getItemsOfHeaders: data => //sadeece 3 kalemi yollar
    client({
      method: 'POST',
      url: '/GetItemsOfHeaders',
      data: { headerIDList: data }
    }).then(res => res),
  getItemsOfHeader: data => //Tüm kalemleri yollar
    client({
      method: 'GET',
      url: '/GetItemsOfHeader',
      params: data
    }).then(res => res),
  getItemsPerDate: data => //Tüm kalemleri yollar
    client({
      method: 'GET',
      url: '/GetItemsPerDate',
      params: data
    }).then(res => res),
  deleteItems: data => //Tüm kalemleri yollar
    client({
      method: 'POST',
      url: '/DeleteItems',
      data: { idList: data }
    }).then(res => res),
};
