import { toast } from 'react-toastify';
import swal from 'sweetalert2';

const errorHandler = err => {
  if (err.response) {
    if (err.response.data) {
      if (err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        swal({
          title: 'Hata',
          text: 'Beklenmeyen Hata!',
          type: 'error',
          confirmButtonText: 'Tamam',
        });
      }
    }

    console.dir(err);
  } else {
    swal({
      title: 'Hata',
      text: 'Sunucudan cevap alınamıyor!',
      type: 'error',
      confirmButtonText: 'Tamam',
    });
    console.dir(err);
  }
};

export default errorHandler;
