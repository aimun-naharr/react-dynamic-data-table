import classnames from "classnames";
import PropTypes from "prop-types";
import { useEffect } from "react";

const DynamicResizableTable = ({
  className,
  mainClass,
  responsive,
  bordered,
  size,
  tableId,
  children,
  fixed = 0,
  ...props
}) => {
  // var tables = document.getElementsByClassName('flexiCol');
  const tables = document.getElementsByClassName(mainClass);
  const resizableGrid = (table) => {
    const tableHeight = table.offsetHeight;
    const row = table.getElementsByTagName("tr")[0],
      cols = row ? row.children : undefined;
    if (!cols) return;

    const paddingDiff = (col) => {
      function getStyleVal(elm, css) {
        return window.getComputedStyle(elm, null).getPropertyValue(css);
      }

      if (getStyleVal(col, "box-sizing") === "border-box") {
        return 0;
      }

      const padLeft = getStyleVal(col, "padding-left");
      const padRight = getStyleVal(col, "padding-right");
      return parseInt(padLeft) + parseInt(padRight);
    };
    const setListeners = (div) => {
      let pageX, curCol, nxtCol, curColWidth, nxtColWidth, tableWidth;

      div.addEventListener("mousedown", function (e) {
        tableWidth = document.getElementById(tableId)?.offsetWidth;
        curCol = e.target.parentElement;
        nxtCol = curCol.nextElementSibling;
        pageX = e.pageX;
        const padding = paddingDiff(curCol);
        curColWidth = curCol.offsetWidth - padding; /// for whole table
        // if ( nxtCol ) nxtColWidth = nxtCol.offsetWidth - padding;
      });

      div.addEventListener("mouseover", function (e) {
        e.target.style.borderRight = "3px solid #FBBC06";
      });

      div.addEventListener("mouseout", function (e) {
        e.target.style.borderRight = "";
      });

      document.addEventListener("mousemove", function (e) {
        if (curCol) {
          const diffX = e.pageX - pageX;
          // if (nxtCol)
          //nxtCol.style.width = (nxtColWidth - (diffX)) + 'px';
          curCol.style.width = `${curColWidth + diffX}px`;

          document.getElementById(tableId).style.width = `${
            tableWidth + diffX
          }px`;
        }
      });

      document.addEventListener("mouseup", function (e) {
        curCol = undefined;
        nxtCol = undefined;
        pageX = undefined;
        nxtColWidth = undefined;
        curColWidth = undefined;
      });
    };

    const createDiv = (height) => {
      const div = document.createElement("div");
      div.style.top = 0;
      div.style.right = 0;
      div.style.width = "5px";
      div.style.boxSizing = "border-box";
      div.style.position = "absolute";
      div.style.cursor = "col-resize";
      div.style.userSelect = "none";
      div.style.height = `${height}px`;
      return div;
    };

    for (let i = fixed; i < cols.length; i++) {
      const div = createDiv(tableHeight);
      cols[i].appendChild(div);
      cols[i].style.position = "relative";
      setListeners(div);
    }
  };
  useEffect(() => {
    for (let i = 0; i < tables.length; i++) {
      resizableGrid(tables[i]);
    }
  }, [tableId]);
  return (
    <>
      <table
        id={tableId}
        // hover
        // responsive={responsive}
        // bordered={bordered}
        size={size}
        className={classnames(
          `${mainClass}`,
          `${className} resize-and-fixed-table`
        )}
        {...props}
      >
        {children}
      </table>
    </>
  );
};

export default DynamicResizableTable;
// ** PropTypes
DynamicResizableTable.propTypes = {
  className: PropTypes.string,
  responsive: PropTypes.bool,
  bordered: PropTypes.bool,
  size: PropTypes.string,
  tableId: PropTypes.string.isRequired,
  mainClass: PropTypes.string.isRequired,
};
