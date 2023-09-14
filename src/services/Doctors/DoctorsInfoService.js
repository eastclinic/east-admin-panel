
// import doctorsState from '../../state/DoctorsState.js'
import doctorsApi from '../../api/DoctorsApi'
import MultiStateManager from "../util/MultiStateManager.class";
/*
Сервисов может быть множество
стейтов может быть множество
Несколько сервисов могут работать с одним стейтом
DoctorsListService и DoctorsListService будут работать с одним стейтом DoctorsState
DoctorsState должен быть синглтоном
DoctorsState должен иметь public методы, для обращения к данным и приватные методы для внутреннего устройства данных
сам объект стейт const state = reactive() должен быть встроен в DoctorsState, и всем выдаваться один и тот же объект

сервис обращается к стейту и выдает лишь необходимые поля

для тестирования можно делать глобальный объект стейта, для отслеживания свойств

Оба сервиса работая с одним мульти стейтом, работают с разными вложенными объектами

Будем считать что вложенные объекты это субстейты

для разных сервисов возможно будут нужны разные наборы данных,
будет так называемый минимальный набор данных, нужный стейту

 */

const DoctorsState = (() => {
    let instance = null;
    let s = 10;
    debugger;
    return class DoctorsState extends MultiStateManager{

        constructor(...args) {
            super (...args);
            if(instance === null) {
                instance = this;
            }
            debugger;
            return instance;
        }
    }
})();

export default {
     state: new DoctorsState,
    //actions
    //todo set definition requestAdapter type
    async fetchServerData(requestAdapter){
        //handle data from request adapters
        if( requestAdapter )    doctorsApi.withRequestData(requestAdapter.toArray());
        if( doctorsState.requestData() )  doctorsApi.withRequestData(doctorsState.requestData());

        const res = await doctorsApi.getReviews();
        if(Object.keys(res).length > 0 && res.items){
            doctorsState.setItems(res.items);
        }
        //todo handle error
        return this;
    },


    //getters
    items(condition){
        if( !condition ) return doctorsState.getItems();
    },



}
