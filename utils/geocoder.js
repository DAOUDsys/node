import NodeGeocoder from "node-geocoder";

const options = {
  provider: 'mapquest',
  httpAdapter: "http",
  apiKey: 'eoXpar5NIl7toZwjMRAGzwGXT5CcfHXU',
  formatter: null,
};

const geocoder = NodeGeocoder(options);

export default geocoder;
