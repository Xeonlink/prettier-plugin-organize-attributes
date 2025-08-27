
function SimpleJSx() {
    const test = [1, 2, 3, 4, 5];

    return <div>
        {
            test.map(item => <div id={item} className="test-class">{item}</div>)
        }
    </div>
}