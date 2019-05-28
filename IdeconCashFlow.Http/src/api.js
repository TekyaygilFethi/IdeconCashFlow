import axios from 'axios';
import errorHandler from './utils/errorHandler';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure({
  autoClose: 4000,
  draggable: true,
});

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/",
});
// const axiosInstance = axios.create({
//   baseURL: "http://ideconcashflowtest.apphb.com/api/Baslik/",
// });



export const client = axiosInstance;

client.interceptors.response.use(
  response => {
    toast.success(response.data.message, {
      position: toast.POSITION.BOTTOM_RIGHT
    });

    return response
  },
  error => {
    // request error ise once buraya gelir
    toast.error("Hata oluştu !", {
      position: toast.POSITION.BOTTOM_RIGHT
    });

    errorHandler(error);

    return Promise.reject(error);
  },
);

export default {
  inputHeaders: data =>
    client({
      method: 'GET',
      url: `/inputHeaders`, //`inputHeaders  DummyGetAllBasliklar
    }).then(res => res),
  getDetail: data =>
    client({
      method: 'GET',
      url: `/getDetail`,
      data: data
    }).then(res => res),
  saveTitle: data =>
    client({
      method: 'POST',
      url: '/saveTitle',
      data: data
    }).then(res => res),
};
