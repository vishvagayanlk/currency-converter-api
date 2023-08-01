import moment from "moment";

const formatDate = (date: string): string => {
  return moment(date).utc().format("YYYY-MM-DD");
};
export default formatDate;
