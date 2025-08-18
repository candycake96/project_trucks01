import React from "react";
import { Link } from "react-router-dom";
import NewsShow from "../News/Details";

const News = () => {
    return(
<>
<div className="container">
  <div className="p-3">
    <div className="text-concenter">
      <p className="fs-3">ข่าวสารและกิจกรรม</p>
    </div>
  </div>
</div>
      <NewsShow showDeleteButton={false} showDetailsButton={true}/> 
</>
    )
}

export default News;