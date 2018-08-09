import Unit from "./unit";
import TouchObj from "../../scripts/touch/touchobj";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Cjs extends cc.Component {

    @property(Unit)
    unitjs:Unit = null;

    @property(TouchObj)
    touchjs:TouchObj = null;
}
