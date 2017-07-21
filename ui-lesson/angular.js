function Scope(){
	this.$$watchers=[]
}
Scope.prototype.$watch=function(watchFn,listenerFn,valueEq){
	var watcher={
		watchFn:watchFn,
		listenerFn:listenerFn||function(){},
		valueEq:!!valueEq
	}
	this.$$watchers.push(watcher)
}

Scope.prototype.$$areEqual=function(newValue,oldValue,valueEq){
	if(valueEq){
		return _.isEqual(newValue,oldValue);
	}else{
		
	}


}
Scope.prototype.$$digestOnce=function(){
	var dirty,self=this;
	this.$$watchers.forEach(function(watch){
		var newValue=watch.watchFn(self);
		var oldValue=watch.last;
		if(!self.$$areEqual(newValue,oldValue,watch.valueEq)){
			watch.listernerFn(newValue,oldValue,self);
			dirty=true;
		}
		watch.last=(watch.valueEq?_.cloneDeep(newValue):newValue);
	});
	return dirty;
}
Scope.prototype.$digest=function(){
	var dirty,ttl=10;

}