import { render, screen } from "@testing-library/react";
import MapThumb from "../../../../Components/MapThumb";
import renderer from "react-test-renderer";

const devMaps = [
  { title: "test_thumb", fileName: "maps/example_1.jpg", _id: 1 },
  { title: "test_thumb", fileName: "maps/example_2.jpg", _id: 2 },
];

describe("MapThumb", () => {
  it("renders without crashing", () => {
    render(<MapThumb map={devMaps[0]}></MapThumb>);
    expect(screen.getByText('test_thumb')).toBeInTheDocument();
  });
  it("renders child components", () => {
    const testText = "test_child";
    render(
      <MapThumb map={devMaps[0]} id={1}>
        <h1>{testText}</h1>
      </MapThumb>
    );

    expect(screen.getByText(testText)).toBeInTheDocument();
  });

  it("renders correctly", () => {
    const tree = renderer
      .create(
        <MapThumb map={devMaps[0]} />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
