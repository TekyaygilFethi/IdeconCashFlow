import { client } from '../api';

export default function setLocaleHeader(language) {
  if (language) {
    client.defaults.headers.common["language"] = language
  } else {
    delete client.defaults.headers.common["language"];
  }
}
