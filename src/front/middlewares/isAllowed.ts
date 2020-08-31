import AclService from '../../services/acl';

function isAllowed (section, subSection, operation) {
	return function(req, res, next) 
		{
	    try {
	        if (req.session.loggedin) {
	            if (!req.session.roles || !AclService.checkAllRoles(req.session.roles, section, subSection, operation)) {
	            	console.log("Role " + req.session.roles[0] + " for section "+ section +" / "+subSection+" / "+operation+" is NOT allowed.");
	                return res.redirect('/home');
	            }
	            next();
	        } else {
	            return res.redirect('/home');
	        }
	    } catch (e) {
	        return res.redirect('/home');
	    }
	}
};

export default isAllowed;
