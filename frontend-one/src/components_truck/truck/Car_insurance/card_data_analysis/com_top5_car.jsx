import React from "react";

const com_top5_car = () => {
    return (
        <>
            <div className="card">
                <div className="card-body">
                    <div className="p-1">
                        <p className="fw-bolder">
                            ลำดับ 5 กรมธรรม์ทุนสูงสุด
                        </p>
                    </div>
                    <div className="">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>ลำดับ</th>
                                    <th>ชื่อบริษัทประกัน</th>
                                    <th>กรรมธรรม์</th>
                                    <th>เบี้ยประกัน</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>A</td>
                                    <td>10,000</td>
                                    <td>10,000</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>A</td>
                                    <td>10,000</td>
                                    <td>10,000</td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>A</td>
                                    <td>10,000</td>
                                    <td>10,000</td>
                                </tr>
                                <tr>
                                    <td>4</td>
                                    <td>A</td>
                                    <td>10,000</td>
                                    <td>10,000</td>
                                </tr>
                                <tr>
                                    <td>5</td>
                                    <td>A</td>
                                    <td>10,000</td>
                                    <td>10,000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}


export default com_top5_car;