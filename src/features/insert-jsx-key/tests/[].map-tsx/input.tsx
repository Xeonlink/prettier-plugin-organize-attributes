
function SimpleJSx() {
    return <div>
        {
            ["1", "2", "3", "4", "5"].map(item => <div id={item} className="test-class">{item}</div>)
        }
    </div>
}