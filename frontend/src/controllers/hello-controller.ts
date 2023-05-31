import axios from "axios";
import HelloModel from "../models/hello-model";

export async function helloController() {
  const response = await axios({
    method: "GET",
    url: "http://127.0.0.1:5000/",
  });
  const { message }: HelloModel = response.data;
  return "Python: " + message;
}
