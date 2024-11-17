import * as d3 from "d3";

class ColorStats {
  constructor(element) {
    this.element = element;
  }

  buildStats(deck) {
    this.element.innerHTML = "";
    const data = [
      { color: "White", count: 0 },
      { color: "Blue", count: 0 },
      { color: "Black", count: 0 },
      { color: "Red", count: 0 },
      { color: "Green", count: 0 },
      { color: "Colorless", count: 0 },
    ];

    deck.forEach((deckCard, index) => {
      let colors = deckCard.card.getAttribute("colors");
      colors = colors.replaceAll("}{", ",");
      colors = colors.replaceAll("/", ",");
      colors = colors.substring(1, colors.length - 1);
      const colorsArr = colors.split(",");
      const count = deckCard.count;
      for (let i = 0; i < colorsArr.length; i++) {
        switch (colorsArr[i]) {
          case "W":
            data[0].count += count;
            break;
          case "U":
            data[1].count += count;
            break;
          case "B":
            data[2].count += count;
            break;
          case "R":
            data[3].count += count;
            break;
          case "G":
            data[4].count += count;
            break;
          case "C":
            data[5].count += count;
            break;
          default:
            break;
        }
      }
    });

    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2;

    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.color))
      .range([
        "#F0E68C",
        "#4682B4",
        "#2F4F4F",
        "#B22222",
        "#228B22",
        "#A9A9A9",
      ]);

    const pie = d3
      .pie()
      .value((d) => d.count)
      .sort(null);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);
    const label = document.createElement("label");
    label.textContent = "Deck Mana Color Distribution";
    label.classList.add("colorLabel");
    this.element.appendChild(label);
    const svg = d3
      .select(this.element)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const arcs = svg
      .selectAll("arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.color));
  }
}
export { ColorStats };
