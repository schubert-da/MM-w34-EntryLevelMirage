// create the div for our viz
let viz = d3.select(".viz")
    .attr("class", "viz")

let icon_colors = ["#c82b58", "#DD4A48", "#3fac7f", "#444", "#43729d",]

// Parse the Data
d3.csv("entry_job_data.csv", function(data) {

    let job_posting_container = viz.selectAll(".job-item")
        .data(data)
        .enter()
        .append("div")
        .attr("class","job-posting-container")

    let job_header = job_posting_container.append("div")
        .attr("class","job-header")

    let job_icon = job_header.append("div")
        .attr("class","job-icon")
        .html(d => d.field[0])
        .style("background", ()=> { return icon_colors[Math.floor(Math.random() * 5)]} )

    let job_description = job_header.append("div")
        .attr("class","job-description")

    job_description.append("div")
        .attr("class","job-title")
        .html( d => d.field)

    let max_width = document.getElementsByClassName("viz-title")[0].offsetWidth;
    let barScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, max_width])

    job_description.append("div")
        .html( d=> Math.round(d.perc*100)+"%" )
        .attr("class", "bar") 
        .style("width", (d) => { return barScale(+d.perc)+"px"})

    // change size of the bars when resizing the window
    window.onresize = ()=> {
        // get new width of title and change bar widths proportionally
        let max_width = document.getElementsByClassName("viz-title")[0].offsetWidth;
        let barScale = d3.scaleLinear()
            .domain([0, 1])
            .range([0, max_width])

        viz.selectAll(".bar")
        .style("width", (d) => { return barScale(+d.perc)+"px"})
    }

    // section that will be toggled open/close when user clicks on a job header.
    let job_description_expand = job_posting_container.append("div")
        .attr("class","job-description-expand")
    
    let expand_header = job_description_expand.append("span")
        .html(d => job_description_text[d.field] ? job_description_text[d.field] : job_description_text["lorem_ipsum_text"])

    let expand_description =job_description_expand.append("div")
        .attr("class","description-expand")
        .html( d => "<br><b>Requirements:</b> <br>" + "<div class='requirement-bullet'> </div>".repeat(d.perc * 25))

    job_header.on("click", toggleExpand); // event listener to toggle open/closing
})

function toggleExpand(){

    parent_container =this.parentElement;

    if( !parent_container.classList.contains("expand")){ // do this when panel is not expanded
        let rows = this.parentElement.querySelectorAll(".requirement-bullet")
        
        // animations when opening a panel
        let tl = gsap.timeline({ repeat:0 });

        tl.to(this.querySelector(".job-icon"), 2, {scale:1.1, ease: "elastic.out"}, "+=0"); // icon will scale up
        // slowly increase height of expand panel, duration depends on rows.length
        tl.from(this.parentElement.querySelector(".job-description-expand"), rows.length*0.35, { height: 0}, "<"  ) 

        // animate each "requirements" row
        gsap.utils.toArray( rows ).forEach((el, i) => {
            delay = "<+=0.25";
            tl.to(el, { width: (40 + Math.random()*10) + "%", duration: 0.5 }, delay)
        })

        // play the animations
        tl.play()
        parent_container.classList.add("expand");
    }
    else{ // do this when panel is expanded

        // scale down icon to previous size
        let tl = gsap.timeline({ repeat:0 });
        tl.to(this.querySelector(".job-icon"), 2, {scale:1, ease: "elastic.out"}, "+=0");

        tl.play()
        parent_container.classList.remove("expand");

    }
}

job_description_text = {
    "Software & IT Services": 'In the software industry, more than half of these so-called "entry-level" jobs contain requirements that are downright mid-career in their expertise. Requirements can span from experience in a variety of domains to having several years of experience in seemingly unrelated tech stacks.',
    "Recreation & Travel": "The recreation and travel industry does do better than most, with just above 1 in 5 job postings having unrealistic entry-level requirements.",
    "Retail": "The situation on the retail side of things seems to be bit better. Employers may be flexible with their understanding of what counts as prior experience and may often allow entry level job seekers to work after a brief training period.",
    "lorem_ipsum_text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra sed velit sed dignissim. In eu elit iaculis, molestie dui nec, posuer. Nam viverra sed velit sed dignissim. Cras porta erat in vehicula tincidunt. Ut tempus, sapien ac volutpat porta, diam ante maximus augue, id feugiat odio enim eget ipsum."
}