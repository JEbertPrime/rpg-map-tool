import { render, screen, mount } from "@testing-library/react";
import Nav, {LinkWrap} from "../../../../Components/SiteNav";
import renderer from 'react-test-renderer';
describe('LinkWrap', ()=>{
  it("passes on refs",()=>{
    const testProps = {refAs: true}
    render(<LinkWrap {...testProps}><a>test</a></LinkWrap>)
    expect(
      screen.getByText('test')
    ).toBeInTheDocument()

  });
  it('filters invalid children', ()=>{
    const testProps = {refAs: true}
    render(<LinkWrap {...testProps}>dog</LinkWrap>)
    expect(
      screen.getByText('invalid')
    ).toBeInTheDocument()
  })
})
const testSession = [{user:{image:'/maps/example_1.jpg', name: 'Johnny'}},{user:{ name: 'Johnny Testworth'}}]
describe("Nav", () => {
  it("renders without crashing", () => {
    render(<Nav />);
    expect(
      screen.getByRole("navigation")
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {name: 'campaignMaps'})
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {name: 'map'})
    ).toBeInTheDocument();
    
  });
  it('renders user session image correctly', ()=>{
    render(<Nav session={testSession[0]}/>)
    expect(
      screen.getByAltText('user image')
    ).toBeInTheDocument();
  })
  it('renders user session name correctly', ()=>{
    render(<Nav session={testSession[1]}/>)
    expect(
      screen.getByText('Johnny Testworth')
    ).toBeInTheDocument();
  })
  it("renders correctly", ()=>{
    const tree = renderer.create(<Nav />).toJSON();
    expect(tree).toMatchSnapshot();

  })
});