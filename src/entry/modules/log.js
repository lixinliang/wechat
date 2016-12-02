// log
let log = sdk.store('log') || [];

let sid = 0;

sdk.log = function () {
    let expression = `<${ (+new Date) }>${ ([].join.call(arguments, ';')) }`;
    console.log(expression);
    log.push(expression);
    clearTimeout(sid);
    sid = setTimeout(() => {
        sdk.store('log', log);
    }, 100);
};

// statistics the special behavior
sdk.log.occur = function ( eventName ) {
    sdk.log(`[${ eventName }] occured.`);
};

// record of the error situation
sdk.log.error = function ( eventName, reason ) {
    sdk.log(`[${ eventName }] error cause [${ reason.toString() }].`);
};
