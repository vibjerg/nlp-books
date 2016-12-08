import data from './data';
export default function bestBy(author) {
  return data.authors[author].sort((a,b) => a.loans > b.loans)[0];
}