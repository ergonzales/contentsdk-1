import { SitecorePageProps } from "lib/page-props";
import { GetServerSidePropsContext, GetStaticPropsContext } from "next";
import { Plugin } from "..";

class ComponentPropsPlugin implements Plugin {
  order = 10;

  async exec(props: SitecorePageProps, _context: GetServerSidePropsContext | GetStaticPropsContext) {
    // Component-level server props are temporarily bypassed during SDK v2 migration stabilization.
    props.componentProps = props.componentProps || {};
    return props;
  }
}

export const componentPropsPlugin = new ComponentPropsPlugin();
