import React, { Component } from "react";
import Table from "./Table";

function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
      break;
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
      break;
    default:
      return 0;
      break;
  }
}
class Index extends Component {
  render() {
    return (
      <Table
        {...{
          dataSource: Array.from({ length: 20 }, (_, index) => {
            return {
              name: `test-${index}`,
              makeAppointment: randomNum(20, 100),
              use: randomNum(20, 100),
            };
          }),
          columns: [
            {
              title: "test1",
              dataIndex: "name",
              key: "name",
              align: "left",
            },
            {
              title: "test2",
              dataIndex: "makeAppointment",
              key: "makeAppointment",
              align: "center",
            },
            {
              title: "test3",
              dataIndex: "use",
              key: "use",
              align: "center",
            },
          ],
          scroll: { x: "100%", y: 470 },
        }}
      />
    );
  }
}
export default Index;
