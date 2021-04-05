import { render, screen } from "@testing-library/react";
import MapShowcase from "../../../../Components/MapShowcase";
import renderer from 'react-test-renderer';

const devMaps = [{title: 'test_thumb', fileName: 'maps/example_1.jpg', _id:1}, {title: 'test_thumb', fileName: 'maps/example_2.jpg', _id:2}]

describe("MapShowcase", () => {
  it("renders without crashing", () => {
    render(<MapShowcase maps={devMaps}><h1>test</h1></MapShowcase>);
    expect(
      screen.getByRole("heading", {name: 'test'})
    ).toBeInTheDocument();
    expect(
      screen.getAllByText('test_thumb') .length
    ).toBe(devMaps.length)

  });
  it("renders without maps correctly", ()=>{
      render(<MapShowcase >empty</MapShowcase>)
      expect(
          screen.getByText('empty')
      ).toBeInTheDocument();
  })
  it("renders correctly", ()=>{
    const tree = renderer.create(<MapShowcase maps={devMaps}><h1>test</h1></MapShowcase>).toJSON();
    expect(tree).toMatchSnapshot();

  })
});