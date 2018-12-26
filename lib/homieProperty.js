var _ = require('lodash');
var HomieProperty = 
  module.exports = 
  /**
   * 
   * @param {*} homieNode 
   * @param {*} name 
   * @param {*} friendlyName 
   * @param {*} datatype 
   * @param {*} format 
   * @param {*} unit 
   */
  function(homieNode, name, friendlyName, datatype, format, unit) {
  var t = this;
  t.name = name;
  t.setter = null;
  t.isSubscribedToSet = false;
  t.rangeStart = null;
  t.rangeEnd = null;
  t.retained = false;
  t.rangeIndex = null;
  t.homieNode = homieNode;
  t.datatype = datatype
  t.friendlyName = friendlyName
  t.format = format
  t.unit = unit
  t.mqttTopic = t.homieNode.mqttTopic + '/' + t.name;
}
var proto = HomieProperty.prototype;

proto.publishHomieAttributes = function() {
    // advertise new property

    var t = this;
    t.mqttClient = t.homieNode.homieDevice.mqttClient;

    t.mqttClient.publish(t.mqttTopic + '/$name', t.friendlyName, {retain: t.retained})
    if (t.datatype) {
      t.mqttClient.publish(t.mqttTopic + '/$datatype', t.datatype, {retain: t.retained})
    }
    if (t.format) {
      t.mqttClient.publish(t.mqttTopic + '/$format', t.format, {retain: t.retained})
    }
    if (t.unit) {
      t.mqttClient.publish(t.mqttTopic + '/$unit', t.unit, {retain: t.retained})
    }
    // publish Homie setable
    let setable = "false"
    if (t.setter) {
      setable = "true"
    }
    t.homieNode.homieDevice.mqttClient.publish(t.mqttTopic + '/$setable', setable, {retain: t.retained})
    

  
}

proto.setRange = function(start, end) {
  var t = this;

  // Simulating overloaded methods in C++:
  // setRange(rangeObject) and setRange(start, end)
  if (_.isObject(start)) {
    var range = start;
    t.rangeIndex = range.index;
  }
  else {
    t.rangeStart = start;
    t.rangeEnd = end;
  }
  return t;
}

proto.settable = function(setter) {
  var t = this;
  t.setter = setter;
  return t;
}

proto.setRetained = function(val) {
  var t = this;
  t.retained = val;
  return t;
}

proto.send = function(val) {
  var t = this;
  var mqttClient = t.homieNode.homieDevice.mqttClient;
  var topic = t.mqttTopic;
  if (t.rangeIndex !== null) {
    topic += '_' + t.rangeIndex;
  }
  mqttClient.publish(topic, val, {retain: t.retained});
  t.retained = false;
  t.rangeIndex = null;
  return t;
}
