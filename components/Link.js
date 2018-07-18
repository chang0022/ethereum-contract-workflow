import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link as LinkRouter } from '../routes'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  root: {
    color: 'inherit',
    textDecoration: 'inherit',
    '&:hover': {
      textDecoration: 'inherit'
    }
  }
}

function Link(props) {
  const {
    children: childrenProp,
    component: ComponentProp,
    classes,
    className: classNameProp,
    variant,
    route,
    ...other
  } = props

  let Component
  const className = classNames(classes.root, classNameProp)
  const more = {}
  let children = childrenProp

  if (ComponentProp) {
    Component = ComponentProp
    more.className = className
  } else if (route) {
    Component = LinkRouter
    more.route = route
    children = <a className={className}>{children}</a>
  } else {
    Component = 'a'
    more.className = className
  }

  return (
    <Component {...more} {...other}>
      {children}
    </Component>
  )
}

Link.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  route: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'button'])
}

export default withStyles(styles)(Link)
