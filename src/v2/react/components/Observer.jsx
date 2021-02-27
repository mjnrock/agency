import { Fragment } from "react";

import AgencyObservable from "./../../Observable";
import AgencyObserver from "./../../Observer";

import Observable from "./Observable";

export default function Observer(props) {
    const { observer } = props;

    const children = [];
    if(observer.subject instanceof AgencyObservable) {
        children.push(
            <Observable
                key={ observer.__id }
                observable={ observer.subject }
            />
        );
    } else if(observer.subject instanceof AgencyObserver) {
        children.push(
            <Observer
                key={ observer.__id }
                observer={ observer.subject }
            />
        );
    }

    return (
        <Fragment>
            { children }
        </Fragment>
    )
};