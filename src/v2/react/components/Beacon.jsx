import React, { Fragment } from "react";

import AgencyObservable from "./../../Observable";
import AgencyObserver from "./../../Observer";

import Observer from "./Observer";
import Observable from "./Observable";

export default function Beacon(props) {
    const { beacon } = props;

    if(!beacon) {
        return null;
    }

    const members = [ ...beacon.members.entries() ].map(([ ,{ member } ]) => {
        if(member instanceof AgencyObservable) {
            return (
                <Observable
                    key={ member.__id }
                    observable={ member }
                />
            );
        } else if(member instanceof AgencyObserver) {
            return (
                <Observer
                    key={ member.__id }
                    observer={ member }
                />
            );
        }

        return null;
    });

    return (
        <Fragment>
            { members }
        </Fragment>
    )
};