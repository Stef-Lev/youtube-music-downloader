import { toast } from "react-toastify";

export default function notify(msg, options = {}) {
  toast(msg, { ...options });
}
