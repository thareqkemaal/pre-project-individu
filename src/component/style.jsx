import { Button } from "@chakra-ui/react";
import React from "react";

const StylePage = (props) => {

    return(
    <div className="border container pt-5 d-flex flex-column">
        <div className="border pt-3 h-100">
            <Button className="border">Chakra Button Base</Button>
            <button className="btn border">Bootstrap Button Base</button>
        </div>
        <div className="border h-100">
            <Button className="btn-blue-253">Chakra Button Custom</Button>
            <button className="btn btn-blue-253">Bootstrap Button Custom</button>
        </div>
        <div className="border h-100">
            <Button className="btn-blue-253-outline">Chakra Button Custom</Button>
            <button className="btn btn-blue-253-outline">Bootstrap Button Custom</button>
        </div>
    </div>
    )
};

export default StylePage;