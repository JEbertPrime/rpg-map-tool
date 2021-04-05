import { fireEvent, render, screen } from "@testing-library/react";
import SvgBox from "../../../../Components/SvgBox";
import {shallow, mount} from 'enzyme'
const devMaps = [{title: 'test_thumb', fileName: 'maps/example_1.jpg', _id:1}, {title: 'test_thumb', fileName: 'maps/example_2.jpg', _id:2}]

describe("SvgBox", () => {
  it("renders without crashing", () => {
    render(<SvgBox width={600} radius={10} url={devMaps[0].fileName} />);
    expect(screen.getByTestId('zoom')).toBeInTheDocument()
    

  });
  
});