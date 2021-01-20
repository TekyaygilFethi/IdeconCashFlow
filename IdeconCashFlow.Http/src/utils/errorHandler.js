import { toast } from 'react-toastify';
import swal from 'sweetalert2';
import { localStorageData } from './helper'

const errorHandler = err => {
  if (err.response) {
    if (err.response.status === 401) {
      localStorageData.delete("token")
    }
    swal.fire({
      title: 'Hata',
      text: 'Sunucudan cevap alınamıyor!',
      type: 'error',
      confirmButtonText: 'Tamam',
    });

  }
};

export default errorHandler;
