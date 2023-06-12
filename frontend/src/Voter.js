export default function Score(){
let score = 0;
return(
    <div>
        <button
        onClick={
            function(){
                score += 1;
                console.log(score)
            }
        }
        > ^ </button>
        <div>  {score}  </div>
        <button
        onClick={
            function(){
                score -= 1;
                console.log(score)
            }
        }> v </button>
    </div>
)


}