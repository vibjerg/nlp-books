import spell from './spell';

function match(msg) {
  const regex = /.* af (.*)/;
  const matches = msg.match(regex);
  if (matches) {
    return matches[1];
  }

  return false;

}

function getAuthor(msg) {
  return match(msg);
  // Match message
  // Get author
  // return message
}


export default function rules(msg) {
  return getAuthor(msg);
}