import { render, screen } from "@testing-library/react";
import SvgBox from "../../../../Components/SvgBox";
import renderer from 'react-test-renderer';

const devMaps = [{title: 'test_thumb', fileName: 'maps/example_1.jpg', _id:1}, {title: 'test_thumb', fileName: 'maps/example_2.jpg', _id:2}]

describe("SvgBox", () => {
  it("renders without crashing", () => {
    render(<SvgBox height={600} radius={10} />);
    
    

  });
});